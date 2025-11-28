<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSaveRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'p1' => 'nullable|string|max:30',
            'p2' => 'nullable|string|max:30',
            'swap_normal_flying_order' => 'nullable|string',
            'revert_fairy_typing' => 'nullable|string',
        ];
    }
}
