import Component from '@ember/component';
import { set } from '@ember/object';

export default Component.extend({
    attributeBindings: ['draggable'],
    draggable: true,
    tagName: 'span',
    dragStart() {
        this.set('item.isObstructor', false);
    },
    dragLeave() {
        this.attrs.setDragEnteredItem(this.get('item'));
    },
    dragEnd() {
        this.set('item.isDraggable', false);
        this.attrs.onElementDropped();
    }
});
