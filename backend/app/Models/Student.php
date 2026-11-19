<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'student_class_id',
        'name',
        'email',
        'phone',
    ];
    public function studentClass()
    {
        return $this->belongsTo(StudentClass::class);
    }
}
