import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Channel } from 'src/app/models/Channel';
import { ChannelImp } from 'src/app/models/ChannelImp';
import { Topic } from 'src/app/models/Topic';
import { TopicChannelService } from 'src/app/services/topic-channel.service';

@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.css'],
  providers: [MessageService]
})
export class AddChannelComponent implements OnInit {

  @Input() displayAddChannelDialogue: boolean = false;
  @Output() onCloseAddChannelDialogue = new EventEmitter<boolean>();

  createChannelForm: FormGroup;

  constructor(private topicChannelService: TopicChannelService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.createChannelForm = new FormGroup({
      	name: new FormControl(null, Validators.required),
        description: new FormControl(null)
    });
  }
  toggleAddChannelDialogue(){
    this.displayAddChannelDialogue = !this.displayAddChannelDialogue;
    this.onCloseAddChannelDialogue.emit(this.displayAddChannelDialogue);
    this.deleteLocalData();
  }

  deleteLocalData(){
    this.ngOnInit();
  }

  onSubmit(){
    if (this.createChannelForm.valid) {      
      const selectedTopic : Topic = this.topicChannelService.getSelectedTopic();
      const newChannel: Channel = new ChannelImp(this.createChannelForm.value.name, '', selectedTopic._id, selectedTopic.courseId, this.createChannelForm.value.description);
      this.topicChannelService.addChannel(newChannel, selectedTopic).subscribe(res => {
        if ('success' in res) {
          this.toggleAddChannelDialogue();
          this.showInfo(res.success);
        }else {
          this.showError(res.errorMsg);
        }
      })
    }
  }

  showInfo(msg) {
    this.messageService.add({severity:'info', summary: 'Success', detail: msg});
  }

  showError(msg) {
    this.messageService.add({severity:'error', summary: 'Error', detail: msg});
  }

}
