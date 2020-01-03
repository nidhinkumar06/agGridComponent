import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from './multiselect.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { ListFilterPipe } from './list-filter.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [CommonModule, FormsModule, DragDropModule],
  declarations: [MultiSelectComponent, ClickOutsideDirective, ListFilterPipe],
  exports: [MultiSelectComponent]
})

export class MultiSelectDropDownModule {
    static forRoot(): ModuleWithProviders {
      return {
        ngModule: MultiSelectDropDownModule
      };
    }
}
