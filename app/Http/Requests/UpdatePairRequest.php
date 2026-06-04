<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePairRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {

        return $this->user()->can('update', $this->pair);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'playerOnePokemon' => 'nullable|string|max:255',
            'playerTwoPokemon' => 'nullable|string|max:255',
            'playerOneNickname' => 'nullable|string|max:12',
            'playerTwoNickname' => 'nullable|string|max:12',
            'location' => 'nullable|string|max:255',
            'isAlive' => 'nullable|string',
        ];
    }
}
