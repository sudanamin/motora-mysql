import { Component } from '@angular/core';
import { UploadService } from '../upload.service';
import { Upload } from '../upload';
import * as _ from "lodash";

@Component({
  selector: 'upload-form',
  templateUrl: './upoad-form.component.html',
  styleUrls: ['./upoad-form.component.css']
})
export class UpoadFormComponent{

  currentUpload: Upload;
  dropzoneActive:boolean = false;

  constructor(private upSvc: UploadService) { }

  dropzoneState($event: boolean) {
    this.dropzoneActive = $event;
  }

  handleDrop(fileList: FileList) {

    let filesIndex = _.range(fileList.length)

    _.each(filesIndex, (idx) => {
      this.currentUpload = new Upload(fileList[idx]);
      this.upSvc.pushUpload(this.currentUpload)}
    )
  }

}