<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $connection = 'masterlist'; // kung iba ang connection
    protected $table = 'users'; // o masterlist table kung ginamit

    protected $primaryKey = 'EMPLOYID'; // primary key sa masterlist
    public $incrementing = false; // kung varchar ang primary key
    protected $keyType = 'string';

    protected $fillable = [
        'EMPLOYID',
        'EMPNAME',
        'PASSWRD',
        'JOB_TITLE',
        'DEPARTMENT',
        'PRODLINE',
        'STATION',
    ];

    protected $hidden = [
        'PASSWRD',
    ];

    // Map employeeID sa EMPLOYID
    public function getAuthIdentifierName()
    {
        return 'EMPLOYID';
    }

    // Laravel expects password field to be 'password', so map it
    public function getAuthPassword()
    {
        return $this->PASSWRD;
    }
}
