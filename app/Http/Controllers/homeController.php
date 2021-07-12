<?php

use Illuminate\Routing\Controller as BaseController;

class homeController extends BaseController
{
    function home(){
        $logged = false;
        //Check Session
        if(null!==session('_barberapp_mail')){
            $logged = true;
            if(session('_barberapp_typeUser') == 'Cliente'){
                $userInfo = cliente::where("mail", session('_barberapp_mail'))
                                    ->get();
            } else{
                $userInfo = salone::where("mail", session('_barberapp_mail'))
                                    ->get();
            }
        } else{
            $logged = false;
        }

        if($logged == true){
            return view('home')
            ->with("userInfo", $userInfo)
            ->with("sessionTypeUser", session('_barberapp_typeUser'))
            ->with("logged", $logged);
        } else{
            
            return view('home')
            ->with("logged", $logged)
            ->with("sessionTypeUser", session('_barberapp_typeUser'));
        }
    }

    function login(){
        if(!empty(Request::post('mail')) && !empty(Request::post('pass'))){
            $query = "";
            $error = array();
    
            # PASSWORD
            if (strlen(Request::post('pass')) < 8) {
                $error[] = "Caratteri password insufficienti";
            } 
    
            # EMAIL
            if (!filter_var(Request::post('mail'), FILTER_VALIDATE_EMAIL)) {
                $error[] = "Email non valida";
            } else {
                $mail = Request::post('mail');
            }
    
            if(count($error) == 0){
                $typeUser = Request::post('utente');
    
                if($typeUser == 'Cliente'){                
                    $password = Request::post('pass');
                    $userSelect = cliente::where("mail", $mail)->get();
                } else if($typeUser == 'Salone'){
                    $password = Request::post('pass');
                    $userSelect = salone::where("mail", $mail)->get();
                }
                
                if(count($userSelect) == 1){
                    $entry = json_decode($userSelect[0], true);
                    
                    if(Hash::check(Request::post('pass'), $entry['Password'])){
                        if($typeUser == 'Cliente'){
                            session(["_barberapp_mail" => $entry['Mail']]);
                            session(["_barberapp_cf" => $entry['CF']]);
                            session(["_barberapp_typeUser" => $typeUser]);
                        } else{
                            session(["_barberapp_mail" => $entry['Mail']]);
                            session(["_barberapp_iva" => $entry['Iva']]);
                            session(["_barberapp_typeUser" => $typeUser]);
                        }
    
                        return json_encode(array('Login riuscito'));
                    } else{
                        return json_encode(array('Password errata'));
                    }
                }else{
                    return json_encode(array('Username errata'));
                }
            }else{
                return json_encode($error);
            }
        } else{
            return json_encode(array('Riempi i campi'));
        }
    }

    function register(){
        if (!empty(Request::post("nome")) && !empty(Request::post("cognome")) && !empty(Request::post("mail")) && !empty(Request::post("cf")) && !empty(Request::post("pass"))){
        $query = "";
        $error = array();

        # USERNAME
        // Controlla che l'username rispetti il pattern specificato
        if(!preg_match('/^[a-z0-9]+$/i', Request::post("cf"))) {
            $error[] = "Codice fiscale non valido";
        } else {
            $cf = strtolower(Request::post("cf"));
            // Cerco se l'username esiste già o se appartiene a una delle 3 parole chiave indicate
            $res = cliente::where('cf', $cf)->get();

            if (count($res) > 0) {
                $error[] = "Codice fiscale già utilizzato";
            }
        }
        # PASSWORD
        if (strlen(Request::post("pass")) < 8) {
            $error[] = "Caratteri password insufficienti";
        } 

        # EMAIL
        if (!filter_var(Request::post("mail"), FILTER_VALIDATE_EMAIL)) {
            $error[] = "Email non valida";
        } else {
            $mail = strtolower($_POST['mail']);
            $res = cliente::where('mail', $mail)->get();
            if (count($res) > 0) {
                $error[] = "Email già utilizzata";
            }
        }

        if(count($error) == 0){
            $typeUser = Request::post("utente");

            if($typeUser == 'Cliente'){
                $nome = Request::post("nome");
                $cognome = Request::post("cognome");
                
                $password = Request::post("pass");
                $password = Hash::make($password);

                $user = new cliente;
                $user->CF = $cf;
                $user->Nome = $nome;
                $user->Cognome = $cognome;
                $user->Mail = $mail;
                $user->Password = $password;
                $query = $user->save();
            }
            
            if($query){
                echo json_encode(array('Registrazione riuscita'));
            }else{
                echo json_encode(array('Connessione al database fallita'));
            }
        }else{
            echo json_encode($error);
        }
    }
    }

    function logout(){
        Session::flush();
        return redirect('../');
    }
}