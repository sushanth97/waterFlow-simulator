import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
    simulatorData: service(),
    disableNext: computed('simulatorData.{rows,columns}', function() {
        let { rows, columns } = this.simulatorData || {};
        return rows <= 0 && columns <= 0;
    })
});