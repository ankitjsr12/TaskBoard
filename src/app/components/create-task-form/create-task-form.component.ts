import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Task, TaskDraft } from '../../models/task.model';

@Component({
  selector: 'app-create-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './create-task-form.component.html',
})
export class CreateTaskFormComponent implements OnChanges {
  @Input() visible = false;
  @Input() taskToEdit: Task | null = null;
  @Output() submitTask = new EventEmitter<TaskDraft>();
  @Output() cancel = new EventEmitter<void>();

  priorities = ['High', 'Medium', 'Low'] as const;

  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    priority: ['Medium' as 'High' | 'Medium' | 'Low', Validators.required],
    dueDate: ['', Validators.required],
    assignedTo: ['', Validators.required],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit']) {
      if (this.taskToEdit) {
        this.form.setValue({
          title: this.taskToEdit.title,
          description: this.taskToEdit.description,
          priority: this.taskToEdit.priority,
          dueDate: this.taskToEdit.dueDate,
          assignedTo: this.taskToEdit.assignedTo,
        });
      } else {
        this.form.reset({
          title: '',
          description: '',
          priority: 'Medium',
          dueDate: '',
          assignedTo: '',
        });
      }
    }
  }

  get isEditMode(): boolean {
    return !!this.taskToEdit;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitTask.emit(this.form.getRawValue());
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
