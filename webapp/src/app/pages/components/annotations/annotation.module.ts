import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from 'src/app/modules/primeng/primeng.module';
import { StoreModule } from '@ngrx/store';
import { PdfAnnotationToolbarComponent } from './pdf-annotation/pdf-annotation-toolbar/pdf-annotation-toolbar.component';
import { PdfCommentItemComponent } from './pdf-annotation/pdf-comment-item/pdf-comment-item.component';
import { PdfCommentPanelComponent } from './pdf-annotation/pdf-comment-panel/pdf-comment-panel.component';
import { PdfCreateAnnotationComponent } from './pdf-annotation/pdf-create-annotation/pdf-create-annotation.component';
import { PdfMainAnnotationComponent } from './pdf-annotation/pdf-main-annotation/pdf-main-annotation.component';
import { annotationReducer } from './pdf-annotation/state/annotation.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AnnotationEffects } from './pdf-annotation/state/annotation.effects';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfDrawboxComponent } from './pdf-annotation/pdf-drawbox/pdf-drawbox.component';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { PdfReplyItemComponent } from './pdf-annotation/pdf-reply-item/pdf-reply-item.component';
import { PdfReplyPanelComponent } from './pdf-annotation/pdf-reply-panel/pdf-reply-panel.component';
import { MenuModule } from 'primeng/menu';
import { PdfAnnotationSummaryComponent } from './pdf-annotation/pdf-annotation-summary/pdf-annotation-summary.component';



@NgModule({
    declarations: [
        PdfAnnotationToolbarComponent,
        PdfCreateAnnotationComponent,
        PdfCommentPanelComponent,
        PdfCommentItemComponent,
        PdfMainAnnotationComponent,
        PdfDrawboxComponent,
        PdfReplyItemComponent,
        PdfReplyPanelComponent,
        PdfAnnotationSummaryComponent,
    ],
    exports: [
        PdfAnnotationToolbarComponent,
        PdfCreateAnnotationComponent,
        PdfCommentPanelComponent,
        PdfCommentItemComponent,
        PdfMainAnnotationComponent
    ],
    imports: [
        CommonModule,
        PrimengModule,
        PdfViewerModule,
        SharedComponentsModule,
        MenuModule,
        StoreModule.forFeature('annotation', annotationReducer),
        EffectsModule.forFeature([AnnotationEffects]),
    ]
})
export class AnnotationModule { }
