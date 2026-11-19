<?php
namespace App\Http\Controllers;

use App\Http\Requests\StudentClass\StoreStudentClassRequest;
use App\Http\Resources\StudentClassResource;
use App\Models\StudentClass;
use Exception;
use Illuminate\Http\Request;

class StudentClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classes = StudentClass::select('id', 'name')->get();

        return response()->json([
            'message' => 'Student Classes retrieved successfully',
            'data'    => $classes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentClassRequest $storeStudentClassRequest)
    {
        try {
            $studentclass = StudentClass::create(
                $storeStudentClassRequest->validated()
            );

            return response()->json([
                "message" => "Student Class created successfully",
                "data"    => StudentClassResource::make($studentclass),
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
            $studentclass = StudentClass::find($id);

            if (! $studentclass) {
                return response()->json([
                    "message" => "Student Class not found",
                ], 404);
            }

            return response()->json([
                "message" => "Student Class retrieved successfully",
                "data"    => StudentClassResource::make($studentclass),
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                "message" => "Internal server error",
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $studentclass = StudentClass::find($id);

            if (! $studentclass) {
                return response()->json([
                    "message" => "Student Class not found",
                ], 404);
            }

            $studentclass->update($request->all());

            return response()->json([
                "message" => "Student Class updated successfully",
                "data"    => StudentClassResource::make($studentclass->fresh()),
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                "message" => "Internal server error",
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $studentclass = StudentClass::find($id);

            if (! $studentclass) {
                return response()->json([
                    "message" => "Student Class not found",
                ], 404);
            }

            $studentclass->delete();

            return response()->json([
                "message" => "Student Class deleted successfully",
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                "message" => "Internal server error",
            ], 500);
        }
    }
}
