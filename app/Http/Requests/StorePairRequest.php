<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePairRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'playerOnePokemon' => 'required|string|max:255',
            'playerTwoPokemon' => 'required|string|max:255',
            'playerOneNickname' => 'nullable|string|max:12',
            'playerTwoNickname' => 'nullable|string|max:12',
        ];
    }
}
