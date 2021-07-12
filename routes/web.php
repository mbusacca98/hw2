<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Home
Route::get('/', 'homeController@home');
Route::post('loginUser', 'homeController@login');
Route::post('registerUser', 'homeController@registerUser');
Route::post('registerSalone', 'homeController@registerSalone');
Route::get('check_email/{typeUser}/{email}', 'RegController@check_email');
Route::get('check_cf/{typeUser}/{CF}', 'RegController@check_cf');
Route::get('logout', 'homeController@logout');

//Cliente
Route::get('user', 'userController@home');
Route::get('loadSaloniPreferiti/{cf}', 'userController@loadSaloniPreferiti');
Route::get('loadServiziSalone/{iva}', 'userController@loadServiziSalone');
Route::post('insertAppuntamento', 'userController@insertAppuntamento');
Route::get('loadAppuntamentiCliente', 'userController@loadAppuntamentiCliente');
Route::get('disdettaAppCliente/{data}/{salone}', 'userController@disdiciAppuntamento');
Route::get('loadSaloni', 'userController@loadSaloni');
Route::get('removeSalonePreferito/{cf}/{idSalone}', 'userController@removeSalonePreferito');
Route::get('addSaloniPreferiti/{cf}/{idSalone}', 'userController@addSaloniPreferiti');

//Salone
Route::get('salone', 'saloneController@home');
Route::get('loadAppuntamentiSalone', 'saloneController@appuntamenti');
Route::get('disdettaAppSalone/{data}/{cliente}', 'saloneController@disdiciAppuntamento');
Route::get('loadServiziSalone', 'saloneController@loadServizi');
Route::get('deleteServizio/{id}', 'saloneController@deleteServizio');
Route::post('addServizio', 'saloneController@addServizio');