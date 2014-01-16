describe('Layout view', function () {
    var defaultFixturesPath;

    beforeEach(function (done) {
        defaultFixturesPath = jasmine.getFixtures().fixturesPath;
        jasmine.getFixtures().fixturesPath = 'spec/fixtures';
        var navBarContent = jasmine.getFixtures().read('nav_bar_mocked.html');
        setFixtures(sandbox().html(navBarContent));
        require([
            'app/base/views/Layout',
            'locationUtil',
            'backbone'
        ], function (Layout, locationUtil, Backbone) {
            this.layoutView = new Layout({
                el: '#sandbox'
            });
            this.locationUtil = locationUtil;
            this.Backbone = Backbone;
            done();
        }.bind(this));
    });

    afterEach(function () {
        jasmine.getFixtures().fixturesPath = defaultFixturesPath
    });

    it("pushes state on click", function () {
        spyOn(Backbone.history, 'navigate');
        $('#computers-link').click();
        expect(Backbone.history.navigate).toHaveBeenCalledWith('/computer', {
            trigger: true
        });
        $('#persons-link').click();
        expect(Backbone.history.navigate).toHaveBeenCalledWith('/person', {
            trigger: true
        });
    });

    it("sets active link in navbar", function () {
        spyOn(this.locationUtil, 'getPathname').and.returnValue('/computer');
        this.layoutView.setActiveLink();
        expect($('#computers-link').closest('li')).toHaveClass('active');
    });

    it("changes the active link when the url is changed", function () {
        var locationUtil = this.locationUtil,
            layoutView = this.layoutView,
            $personsLink = $('#persons-link');
        spyOn(Backbone.history, 'navigate').and.callFake(function () {
            spyOn(locationUtil, 'getPathname').and.returnValue('/person');
            layoutView.setActiveLink();
        });
        $personsLink.click();
        expect(Backbone.history.navigate).toHaveBeenCalledWith('/person', {
            trigger: true
        });
        expect($personsLink.closest('li')).toHaveClass('active');
    });

});
