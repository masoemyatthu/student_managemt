<?php
namespace App\Http\Controllers;

use App\Http\Requests\Student\StoreStudentRequest;
use App\Http\Requests\Student\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use Exception;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $students = Student::with('studentClass')->get();

            return response()->json([
                "message" => "Students retrieved successfully",
                "data"    => StudentResource::collection($students),
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                "message" => "Internal server error",
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentRequest $storeStudentRequest)
    {
        try {
            $student = Student::create(
                $storeStudentRequest->validated()
            );

            $student->load('studentClass');

            return response()->json([
                "message" => "Student created successfully",
                "data"    => StudentResource::make($student),
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                "message" => "Internal server error",
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $student = Student::with('studentClass')->findOrFail($id);

            return response()->json([
                "message" => "Student retrieved successfully",
                "data"    => StudentResource::make($student),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                "message" => "Student not found",
            ], 404);

        } 
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateStudentRequest $updateStudentRequest,
        string $id
    ) {
        try {
            $student = Student::findOrFail($id);

            $student->update(
                $updateStudentRequest->validated()
            );

            $student->load('studentClass');

            return response()->json([
                "message" => "Student updated successfully",
                "data"    => StudentResource::make($student),
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                "message" => "Student not found",
            ], 404);

        } 
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $student = Student::findOrFail($id);

            $student->delete();

            return response()->json([
                "message" => "Student deleted successfully",
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                "message" => "Student not found",
            ], 404);

        } 
    }
}
