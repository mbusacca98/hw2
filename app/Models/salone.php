<?php

use Illuminate\Database\Eloquent\Model;

class salone extends Model{
    protected $table = 'salone';
    protected $primaryKey = 'Iva';
    protected $autoIncrement = false;
    protected $keyType = 'string';
    public $timestamps = false;

    public function serviziSalone(){
        return $this->hasMany('servizi', 'idSalone', 'Iva');
    }

    public function appSalone(){
        return $this->hasMany('appuntamento', 'salone', 'Iva');
    }
}