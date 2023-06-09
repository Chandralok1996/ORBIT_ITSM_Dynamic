import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AdminService, ToasterService } from 'src/app/_services';

@Component({
  selector: 'app-form-master',
  templateUrl: './form-master.component.html',
  styleUrls: ['./form-master.component.css']
})

export class FormMasterComponent {
  formData: any;
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['sr', 'form_name', 'description', 'active_status', 'created_at', 'action'];

  private formListSubscription: Subscription = new Subscription();

  constructor(private adminService: AdminService, private toaster: ToasterService) {
    this.getFormData();
  }

  ngOnInit(): void { }

  getFormData(): void {
    this.formListSubscription.add(
      this.adminService.getFormList().subscribe((res: any) => {
        if (res.status == 200) {
          this.formData = res.rows;
          this.dataSource = new MatTableDataSource(this.formData);
          this.dataSource.paginator = this.paginator;
          this.toaster.success(res.message);
        } else {
          this.toaster.error(res.message);
        }
      }, (error: any) => {
        this.toaster.error(`${error.status} ${error.statusText}`);
      })
    );
  }

  addFormModel(): void {
    console.log("object")
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    this.formListSubscription.unsubscribe();
  }

}
