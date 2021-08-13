import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    simulatorData: service(),
    resetController(controller) {
        this.simulatorData.setProperties({
            rows: 0,
            columns: 0,
            obstructor: 0
        });
        controller.set('canShowEntryGrid', false);
    }  
});
