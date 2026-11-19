<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'student_class_id' => $this->student_class_id,
            'name'             => $this->name,
            'email'            => $this->email,
            'phone'            => $this->phone,

            'student_class'    => $this->whenLoaded('studentClass', function () {
                return [
                    'id'   => $this->studentClass?->id,
                    'name' => $this->studentClass?->name,
                ];
            }),

            'created_at'       => $this->created_at,
        ];
    }
}
