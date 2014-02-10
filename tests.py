import json
import unittest
from flask.ext.testing import TestCase
from flask_restless_test import app, db


class FlaskRestlessTestCase(TestCase):
    SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/testingdb.db'
    TESTING = True

    def create_app(self):
        app.config['SQLALCHEMY_DATABASE_URI'] = self.SQLALCHEMY_DATABASE_URI
        app.config['TESTING'] = self.TESTING
        return app

    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()


class TestAPI(FlaskRestlessTestCase):

    def test_index(self):
        response = self.client.get('/')
        self.assert200(response)

    def test_computer_endpoint(self):
        response = self.client.get('/api/computer')
        self.assert200(response)
        response_json = response.json
        self.assertListEqual(response_json['objects'], [])
        self.assertEqual(response_json['total_pages'], 0)
        self.assertEqual(response_json['num_results'], 0)
        self.assertEqual(response_json['page'], 1)
        response = self.client.post('/api/computer', data=json.dumps({
            'name': u"Test 1",
            'vendor': u"Test Vendor 1",
            'purchase_time': u"2013-11-11T11:11",
        }), content_type='application/json')
        self.assert_status(response, 201)
        expected_response_content = {
            u'name': u"Test 1",
            u'vendor': u"Test Vendor 1",
            u'purchase_time': u"2013-11-11T11:11:00",
            u'notes': [],
            u'owner': None,
            u'owner_id': None,
        }
        self.assertDictContainsSubset(expected_response_content, response.json)
        computer_id = response.json['id']
        expected_response_content[u'id'] = computer_id
        response = self.client.get('/api/computer')
        response_json = response.json
        self.assertEqual(len(response_json['objects']), 1)
        self.assertDictEqual(expected_response_content, response_json['objects'][0])
        self.assertEqual(response_json['total_pages'], 1)
        self.assertEqual(response_json['num_results'], 1)
        self.assertEqual(response_json['page'], 1)
        response = self.client.get('/api/computer/{}'.format(computer_id))
        self.assert200(response)
        self.assertDictEqual(response.json, expected_response_content)
        response = self.client.put('/api/computer/{}'.format(computer_id), data=json.dumps({
            'name': u"Test 1 updated"
        }), content_type='application/json')
        self.assert200(response)
        expected_response_content[u'name'] = u"Test 1 updated"
        self.assertDictEqual(response.json, expected_response_content)
        response = self.client.get('/api/computer/{}'.format(computer_id))
        self.assert200(response)
        self.assertDictEqual(response.json, expected_response_content)

    def test_computer_notes(self):
        response = self.client.get('/api/computer')
        self.assert200(response)
        self.assertListEqual(response.json['objects'], [])
        note_created_at = '2013-11-27T18:54:37'
        computer_data = {
            u'name': u"Test with Notes",
            u'vendor': u"Vendor",
            u'notes': [
                {
                    u'text': u"Note1",
                    u'created_at': note_created_at
                }
            ]
        }
        response = self.client.post('/api/computer', content_type='application/json', data=json.dumps(computer_data))
        self.assert_status(response, 201)
        response_json = response.json
        self.assertEqual(response_json[u'name'], computer_data[u'name'])
        self.assertEqual(response_json[u'vendor'], computer_data[u'vendor'])
        self.assertEqual(len(response_json[u'notes']), 1)
        note = response_json[u'notes'][0]
        self.assertEqual(note[u'text'], u"Note1")
        self.assertEqual(note[u'created_at'], note_created_at)
        self.assertIn(u'id', note)
        computer_data[u'notes'][0][u'id'] = note[u'id']
        computer_data[u'notes'].append({
            u'text': u'Note2',
        })
        computer_id = response_json[u'id']
        response = self.client.put('/api/computer/{}'.format(computer_id),
                                   data=json.dumps(computer_data),
                                   content_type='application/json')
        self.assert200(response)
        response_json = response.json
        note = response_json[u'notes'][0]
        self.assertEqual(note[u'text'], u"Note1")
        self.assertEqual(note[u'created_at'], note_created_at)
        note = response_json[u'notes'][1]
        self.assertEqual(note[u'text'], u"Note2")
        self.assertIn(u'created_at', note)
        response = self.client.get('/api/computer')
        self.assert200(response)
        computers = response.json['objects']
        self.assertIsInstance(computers, list)
        self.assertEqual(len(computers), 1)
        computer = computers[0]
        self.assertEqual(computer[u'id'], computer_id)
        self.assertEqual(computer[u'name'], u"Test with Notes")
        self.assertEqual(computer[u'vendor'], u"Vendor")
        self.assertEqual(len(computer[u'notes']), 2)

    def test_persons(self):
        response = self.client.get('/api/people')
        self.assert200(response)
        self.assertListEqual(response.json['objects'], [])
        person_data = {
            u'name': u"Test Person 1",
            u'birth_date': u"1981-05-16"
        }
        response = self.client.post('/api/person', data=json.dumps(person_data),
                                    content_type='application/json')
        self.assert_status(response, 201)
        self.assertDictContainsSubset(person_data, response.json)
        person_data[u'id'] = response.json[u'id']
        response = self.client.get('/api/person/{}'.format(person_data[u'id']),
                                   content_type='application/json')
        self.assert200(response)
        response_json = response.json
        self.assertDictContainsSubset(person_data, response_json)
        self.assertIn(u'computers', response_json)
        self.assertListEqual(response_json[u'computers'], [])
        self.assertNotIn(u'computers_count', response_json)
        response = self.client.get('/api/people')
        self.assert200(response)
        self.assertListEqual(response.json['objects'], [
            {
                u'name': u"Test Person 1",
                u'birth_date': u'1981-05-16',
                u'id': person_data[u'id'],
                u'computers_count': 0,
            }
        ])
        computer_data = {
            u'name': u"Computer1",
            u'vendor': u"Vendor1",
            u'owner_id': person_data[u'id'],
            u'purchase_time': u'2013-11-11T11:11:11',
        }
        response = self.client.post('/api/computer', data=json.dumps(computer_data),
                                    content_type='application/json')
        self.assert_status(response, 201)
        computer_data[u'id'] = response.json[u'id']
        self.assertDictEqual(response.json[u'owner'], {
            u'name': u"Test Person 1",
            u'birth_date': u'1981-05-16',
            u'id': person_data[u'id'],
        })
        response = self.client.get('/api/people')
        self.assert200(response)
        self.assertListEqual(response.json['objects'], [
            {
                u'name': u"Test Person 1",
                u'birth_date': u'1981-05-16',
                u'id': person_data[u'id'],
                u'computers_count': 1,
            }
        ])
        response = self.client.get('/api/person/{}'.format(person_data[u'id']),
                                   content_type='application/json')
        self.assert200(response)
        response_json = response.json
        self.assertListEqual(response_json[u'computers'], [computer_data])

    def test_person_uniqueness(self):
        person_data = {
            u'name': u"Test Person U",
            u'birth_date': u"1981-05-16"
        }
        response = self.client.post('/api/person', data=json.dumps(person_data),
                                    content_type='application/json')
        self.assert_status(response, 201)
        response = self.client.post('/api/person', data=json.dumps(person_data),
                                    content_type='application/json')
        self.assert400(response)
        self.assertDictEqual(response.json, {
            u'validation_errors': {
                u'name': u"The field is not unique"
            }
        })

    def test_computer_invalid(self):
        computer_data = {
            u'vendor': u"Some vendor",
            u'purchase_time': u"2013-11-11T11:11:11"
        }
        response = self.client.post('/api/computer',
                                    data=json.dumps(computer_data),
                                    content_type='application/json')
        self.assert400(response)
        self.assertDictEqual(response.json, {
            u'validation_errors': {
                u'name': u'Please enter a value'
            }
        })
        computer_data[u'name'] = u''
        response = self.client.post('/api/computer',
                                    data=json.dumps(computer_data),
                                    content_type='application/json')
        self.assert400(response)
        self.assertDictEqual(response.json, {
            u'validation_errors': {
                u'name': u'Please enter a value'
            }
        })

    def test_computer_name_unique(self):
        computer_data = {
            u'name': u"Macbook Pro",
            u'vendor': u"Apple",
            u'purchase_time': u"2013-11-11T11:11:11",
        }
        response = self.client.post('/api/computer',
                                    data=json.dumps(computer_data),
                                    content_type='application/json')
        self.assert_status(response, 201)
        response = self.client.post('/api/computer',
                                    data=json.dumps(computer_data),
                                    content_type='application/json')
        self.assert400(response)
        self.assertDictEqual(response.json, {
            u'validation_errors': {
                u'name': u"The field is not unique"
            }
        })

    def test_computers_paging(self):
        for i in range(5):
            self.client.post('/api/computer', data=json.dumps({
                u'name': u"Computer{}".format(i + 1),
                u'vendor': u"Vendor{}".format(i + 1),
                u'purchase_time': u"2013-11-11T11:11:11",
            }), content_type='application/json')
        response = self.client.get('/api/computer', content_type='application/json')
        self.assert200(response)
        self.assertEqual(len(response.json['objects']), 5)
        self.assertEqual(response.json['num_results'], 5)
        self.assertEqual(response.json['page'], 1)
        self.assertEqual(response.json['total_pages'], 1)
        for i in range(5, 25):
            self.client.post('/api/computer', data=json.dumps({
                u'name': u"Computer{}".format(i + 1),
                u'vendor': u"Vendor{}".format(i + 1),
                u'purchase_time': u"2013-11-11T11:11:11",
            }), content_type='application/json')
        response = self.client.get('/api/computer', content_type='application/json')
        self.assert200(response)
        self.assertEqual(len(response.json['objects']), 10)
        self.assertEqual(response.json['num_results'], 25)
        self.assertEqual(response.json['page'], 1)
        self.assertEqual(response.json['total_pages'], 3)
        response = self.client.get('/api/computer?page=1', content_type='application/json')
        self.assert200(response)
        self.assertEqual(len(response.json['objects']), 10)
        self.assertEqual(response.json['num_results'], 25)
        self.assertEqual(response.json['page'], 1)
        self.assertEqual(response.json['total_pages'], 3)
        response = self.client.get('/api/computer?page=2', content_type='application/json')
        self.assert200(response)
        self.assertEqual(len(response.json['objects']), 10)
        self.assertEqual(response.json['num_results'], 25)
        self.assertEqual(response.json['page'], 2)
        self.assertEqual(response.json['total_pages'], 3)
        response = self.client.get('/api/computer?page=3', content_type='application/json')
        self.assert200(response)
        self.assertEqual(len(response.json['objects']), 5)
        self.assertEqual(response.json['num_results'], 25)
        self.assertEqual(response.json['page'], 3)
        self.assertEqual(response.json['total_pages'], 3)


if __name__ == '__main__':
    unittest.main()
