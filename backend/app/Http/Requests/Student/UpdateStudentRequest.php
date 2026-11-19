<?php
namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $studentId = $this->route('student') ?? $this->route('id');

        return [
            "student_class_id" => "required|integer|exists:student_classes,id",
            "name"             => "required|string",
            "email"            => [
                "required",
                "string",
                "email",
                Rule::unique('students', 'email')->ignore($studentId),
            ],
            "phone"            => "nullable|string",
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            "student_class_id.required" => "Student class id is required.",
            "student_class_id.exists"   => "Selected student class does not exist.",
            "name.required"             => "Name is required.",
            "email.required"            => "Email is required.",
            "email.email"               => "Please enter a valid email address.",
            "email.unique"              => "This email is already registered.",
        ];
    }
}
