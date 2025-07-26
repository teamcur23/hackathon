<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadReceiptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image' => [
                'required',
                'image',
                'mimes:jpeg,jpg,png,heic,webp',
                'max:10240' // 10MB max
            ],
            'notes' => 'nullable|string|max:1000'
        ];
    }

    public function messages(): array
    {
        return [
            'image.required' => 'Please select a receipt image to upload.',
            'image.image' => 'The file must be a valid image.',
            'image.mimes' => 'Only JPEG, PNG, HEIC, and WebP images are allowed.',
            'image.max' => 'The image size must not exceed 10MB.',
        ];
    }
}
