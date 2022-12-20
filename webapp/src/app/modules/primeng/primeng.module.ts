import { NgModule } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import {TabViewModule} from 'primeng/tabview';
import {ToolbarModule} from 'primeng/toolbar';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {MenubarModule} from 'primeng/menubar';
import {FileUploadModule} from 'primeng/fileupload';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {PaginatorModule} from 'primeng/paginator';
import {PanelModule} from 'primeng/panel';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {DividerModule} from 'primeng/divider';
import {ScrollerModule} from 'primeng/scroller';

const PrimeNgComponents = [
  AvatarModule,
  AvatarGroupModule,
  InputTextModule,
  ButtonModule,
  PasswordModule,
  TabViewModule,
  ToolbarModule,
  ToggleButtonModule,
  MenubarModule,
  FileUploadModule,
  InputTextModule,
  InputTextareaModule,
  PaginatorModule,
  PanelModule,
  DropdownModule,
  MultiSelectModule,
  DividerModule,
  ScrollerModule
];

@NgModule({
  imports: [PrimeNgComponents],
  exports: [PrimeNgComponents],
})
export class PrimengModule {}
