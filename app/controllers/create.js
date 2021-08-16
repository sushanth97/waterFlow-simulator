import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed, set } from '@ember/object';

export default Controller.extend({
    simulatorData: service(),
    canShowEntryGrid: false,
    canShowReset: false,
    obstructorModel: computed('simulatorData.obstructor', {
        get() {
            return this.getObstructorModel();
        },
        set(key, value) {
            return value;
        }    
    }),
    isNoObstructionPresent: computed('obstructorModel.@each.isObstructor', function() {
        return (this.obstructorModel || []).isEvery('isObstructor');
    }),
    entryGridArray: computed('simulatorData.{rows,columns}', {
        get() {
            return this.getEntryGridArray();
        },
        set(key, value) {
            return value;
        }    
    }),
    gridModel: computed('simulatorData.{rows,columns}', {
        get() {
            return this.getContainerData();
        },
        set(key, value) {
            return value;
        }    
    }),
    getObstructorModel() {
        let { obstructor } = this.simulatorData || {};
        let obstructorData = new Array(obstructor);
        for (let i=0; i<obstructor; i++) {
            obstructorData[i] = {
                isDraggable: true,
                isObstructor: true,
            };
        }
        return obstructorData;
    },
    getEntryGridArray() {
        let { columns } = this.simulatorData || {};
        let arr = [];
        for (let i=0; i< columns; i++) {
            arr[i] = {
                canShowColumn: true,
                isSelected: false
            };
        }
        return arr;
    },
    getContainerData() {
        let { rows, columns } = this.simulatorData || {};
        let model = new Array(rows);
        for (let i = 0; i < rows; i++) {
            model[i] = new Array(columns);
            for (let j=0; j<columns; j++) {
                model[i][j] = {
                    isObstructor: false,
                    isWaterFilled: false,
                    isDraggable: false,
                    style: `transition-delay:${i}s`
                };
            }
        }
        return model;
    },
    processStimulation(model, row, column, transition) {
        let { rows: inputRows, columns: inputColumns } = this.simulatorData || {};
        let isRowExited = row >= Number(inputRows) || row < 0;
        let isColumnExited = column >= Number(inputColumns) || column < 0;
        if (isRowExited || isColumnExited) {
            return model;
        }
        let grid = model[row][column];  
        if (grid.isObstructor) {
            let locModel;
            let leftGrid = model[row-1][column-1];
            if (leftGrid && (leftGrid.isObstructor || leftGrid.isWaterFilled)) {
                locModel= model;
            } else {    
                locModel = this.processStimulation(model, row-1, column-1, transition);
            }
            let rightGrid = model[row-1][column+1];
            if (rightGrid && (rightGrid.isObstructor || rightGrid.isWaterFilled)) {
                return model;
            }
            return this.processStimulation(locModel, row-1, column+1, transition);
        } else {
            set(grid, 'isWaterFilled', true);
            set(grid, 'style', `transition-delay:${transition}s`);
            return this.processStimulation(model, row+1, column, transition+1);
        }
        
    },
    actions: {
        resetSimulation() {
            this.set('obstructorModel', this.getObstructorModel());
            this.set('entryGridArray', this.getEntryGridArray());
            this.set('gridModel', this.getContainerData());
            this.set('canShowEntryGrid', false);
            this.set('canShowReset', false);
        },
        setEntryPoint(item, index) {
            this.entryGridArray.setEach('canShowColumn', false);
            set(item, 'canShowColumn', true);
            set(item, 'isSelected', true);
            this.set('canShowReset', true);
            this.send('startStimulating', index);
        },
        startStimulating(val) {
            let cloneModel = this.gridModel;
            cloneModel = this.processStimulation(cloneModel, 0, Number(val), 1);
            this.set('gridModel', cloneModel);
        }
    }
});