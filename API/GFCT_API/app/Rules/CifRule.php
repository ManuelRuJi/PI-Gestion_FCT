<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class CifRule implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        //Devolvemos true si coincide con la Expresion Regular
        return preg_match('/^[A-Z]{1}[0-9]{8}$/', $value);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'El formato del CIF es incorrecto.';
    }
}
