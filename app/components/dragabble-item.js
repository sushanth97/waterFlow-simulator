import Component from '@ember/component';
import { set } from '@ember/object';

export default Component.extend({
    attributeBindings: ['draggable'],
    classNames: ['grid', 'float-left',],
    draggable: true,
    dragLeave() {
        this.attrs.setDragEnteredItem(this.get('item'));
    },
    dragEnd() {
        this.set('item.isDraggable', false);
        this.set('item.isObstructor', false);
        this.attrs.onElementDropped();
    }
});
