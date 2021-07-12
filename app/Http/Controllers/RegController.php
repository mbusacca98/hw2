<?php

use Illuminate\Routing\Controller as BaseController;

class RegController extends BaseController
{
    function check_email(){
        $query = "";

        if(request("typeUser") == 'cliente'){
            $query = cliente::where('mail', request("email"))->get();
        } else if(request("typeUser") == 'salone'){
            $query = salone::where('mail', request("email"))->get();
        }

        $json = json_encode(array('exist' => count($query) > 0 ? true : false));

        echo $json;
    }

    function check_cf(){
        $query = "";

        if(request("typeUser") == 'cliente'){
            $query = cliente::where('CF', request("cf"))->get();
        } 

        $json = json_encode(array('exist' => count($query) > 0 ? true : false));

        echo $json;
    }
}