<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class StrongPassword implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        //
    }

    public function passes($attribute, $value)
    {
        return preg_match('/[A-Z]/', $value) && // huruf besar
               preg_match('/[a-z]/', $value) && // huruf kecil
               preg_match('/[0-9]/', $value);   // angka
    }

    public function message()
    {
        return 'The :attribute must contain at least one uppercase letter, one lowercase letter, and one number.';
    }
}