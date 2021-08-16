import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    simulatorData: service(),
    redirect() {
        this._super(...arguments);
        let { rows, columns } = this.simulatorData || {};
        if (rows <=0 && columns <=0) {
            this.transitionTo('application');
        }
    },
    resetController(controller) {
        this.simulatorData.setProperties({
            rows: 0,
            columns: 0,
            obstructor: 0
        });
        controller.setProperties({
            'canShowEntryGrid': false,
            'canShowReset': false
        });
    }  
});
