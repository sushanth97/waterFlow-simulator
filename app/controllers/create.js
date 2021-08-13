import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed, set } from '@ember/object';

export default Controller.extend({
    simulatorData: service(),
    canShowEntryGrid: false,
    obstructorModel: computed('simulatorData.obstructor', function() {
        //move it to function to support reset option
        let { obstructor } = this.simulatorData || {};
        let obstructorData = new Array(obstructor);
        for (let i=0; i<obstructor; i++) {
            obstructorData[i] = {
                isDraggable: true,
                isObstructor: true,
            };
        }
        return obstructorData;
    }),
    isNoObstructionPresent: computed('obstructorModel.@each.isObstructor', function() {
        return (this.obstructorModel || []).isEvery('isObstructor');
    }),
    columnArray: computed('simulatorData.columns}', function() {
        let { columns } = this.simulatorData || {};
        let arr = [];
        for (let i=0; i< columns; i++) {
            arr[i] = i;
        }
        return arr;
    }),
    gridModel: computed('simulatorData.{rows,columns}', {
        get() {
            //move it to function to support reset option
            let { rows, columns } = this.simulatorData || {};
            let model = new Array(rows);
            for (let i = 0; i < rows; i++) {
                model[i] = new Array(columns);
                for (let j=0; j<columns; j++) {
                    model[i][j] = {
                        isObstructor: false,
                        isWaterFilled: false,
                        isDraggable: false
                    };
                }
            }
            return model;
        },
        set(key, value) {
            return value;
        }    
    }),
    processStimulation(model, row, column) {
        let { rows: inputRows, columns: inputColumns } = this.simulatorData || {};
        let isRowExtended = row >= Number(inputRows) || row < 0;
        let isColumnExtended = column >= Number(inputColumns) || column < 0;
        if (isRowExtended || isColumnExtended) {
            return model;
        }
        let grid = model[row][column];  
        if (grid.isObstructor) {
            let locModel= model;
            let leftGrid = model[row-1][column-1];
            if (leftGrid && (!leftGrid.isObstructor || !leftGrid.isWaterFilled)) {
                locModel = this.processStimulation(model, row-1, column-1);
            }
            let rightGrid = model[row-1][column+1];
            if (rightGrid && (rightGrid.isObstructor || rightGrid.isWaterFilled)) {
                return model;
            }
            return this.processStimulation(locModel, row-1, column+1);
        } else {
            set(grid, 'isWaterFilled', true);
            return this.processStimulation(model, row+1, column);
        }
        
    },
    actions: {
        markAsObstructor(obj) {
            set(obj, 'isObstructor', true);
        },
        startStimulating(val) {
            let cloneModel = this.gridModel;
            cloneModel = this.processStimulation(cloneModel, 0, Number(val));
            this.set('gridModel', cloneModel);
        }
    }
});