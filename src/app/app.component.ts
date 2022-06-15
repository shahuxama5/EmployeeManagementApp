import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Employee } from './models/employee.model';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Employee Management App';
  employeeForm!: FormGroup;
  employees!: Employee[];
  employeesToDisplay!: Employee[];
  educationOptions = [
    '6th grade',
    'matric',
    'diploma',
    'graduate',
    'post-graduate',
    'phD'
  ];

  @ViewChild('fileInput') fileInput: any;
  @ViewChild('addEmployeeButton') addEmployeeButton: any;

  constructor(private formBuilder: FormBuilder, private employeeService: EmployeeService) {
    this.employeeForm = this.formBuilder.group({});
    this.employees = [];
    this.employeesToDisplay = this.employees;
   }

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group(
      {
        firstName: this.formBuilder.control(''),
        lastName: this.formBuilder.control(''),
        birthdate: this.formBuilder.control(''),
        gender: this.formBuilder.control(''),
        education: this.formBuilder.control('default'),
        company: this.formBuilder.control(''),
        jobExperience: this.formBuilder.control(''),
        salary: this.formBuilder.control(''),
      }
    );

    this.employeeService.getEmployees().subscribe(res => {
      for (let emp of res) {
        this.employees.unshift(emp);
      }
      this.employeesToDisplay = this.employees;
    });
  }

  addEmployee() {
    let employee: Employee = {
      firstName: this.FirstName.value,
      lastName: this.LastName.value,
      birthdate: this.BirthDate.value,
      gender: this.Gender.value,
      education: this.educationOptions[parseInt(this.Education.value)],
      company: this.Company.value,
      jobExperience: this.JobExperience.value,
      salary: this.Salary.value,
      profile: this.fileInput.nativeElement.files[0]?.name,
    };
    this.employeeService.postEmployee(employee).subscribe(res => {
      this.employees.unshift(res);
      alert('Employee has been added!');
      this.clearForm();
    });
  }

  editEmployee(event: any) {
    this.employees.forEach((val, index)=> {
      if(val.id === parseInt(event)) {
        this.setForm(val);
      }
    });
    this.removeEmployee(event);
    this.addEmployeeButton.nativeElement.click();
  }

  setForm(emp: Employee) {
    this.FirstName.setValue(emp.firstName);
    this.LastName.setValue(emp.lastName);
    this.BirthDate.setValue(emp.birthdate);
    this.Gender.setValue(emp.gender);
    let educationIndex = 0;
    this.educationOptions.forEach((val, index)=> {
      if (val === emp.education) {
        educationIndex = index;
      }
    });
    this.Company.setValue(emp.company);
    this.JobExperience.setValue(emp.jobExperience);
    this.Salary.setValue(emp.salary);
    this.fileInput.nativeElement.vlue = '';
  }

  removeEmployee(event: any){
    this.employees.forEach((val, index)=> {
      if (val.id === parseInt(event)) {
        this.employeeService.deleteEmployee(event).subscribe((res)=> {
          this.employees.splice(index, 1);
        });
      }
    });
  }

  searchEmployees(event: any) {
    let filteredEmployees: Employee[] = [];
    if (event === '') {
      this.employeesToDisplay = this.employees;
    }
    else {
      filteredEmployees = this.employees.filter((val, index)=> {
        let targetKey = val.firstName.toLocaleLowerCase() + '' + val.lastName.toLocaleLowerCase();
        let searchKey = event.toLocaleLowerCase();
        return targetKey.includes(searchKey);
      });
      this.employeesToDisplay = filteredEmployees;
    }
  }

  clearForm() {
    this.FirstName.setValue('');
    this.LastName.setValue('');
    this.BirthDate.setValue('');
    this.Education.setValue('');
    this.Gender.setValue('');
    this.Company.setValue('');
    this.Salary.setValue('');
    this.JobExperience.setValue('');
    this.fileInput.nativeElement.value = '';
  }

  public get FirstName(): FormControl {
    return this.employeeForm.get('firstName') as FormControl;
  }

  public get LastName(): FormControl {
    return this.employeeForm.get('lastName') as FormControl;
  }

  public get BirthDate(): FormControl {
    return this.employeeForm.get('birthdate') as FormControl;
  }

  public get Gender(): FormControl {
    return this.employeeForm.get('gender') as FormControl;
  }

  public get Education(): FormControl {
    return this.employeeForm.get('education') as FormControl;
  }

  public get Company(): FormControl {
    return this.employeeForm.get('company') as FormControl;
  }

  public get JobExperience(): FormControl {
    return this.employeeForm.get('jobExperience') as FormControl;
  }

  public get Salary(): FormControl {
    return this.employeeForm.get('salary') as FormControl;
  }

}
