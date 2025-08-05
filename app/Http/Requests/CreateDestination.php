<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateDestination extends FormRequest
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
            'destination_type_type' => 'required|string|max:255|in:App\\Models\\S3Destination,App\\Models\\AzureDestination',
            'bucket_name' => 'nullable|required_if:destination_type_type,App\\Models\\S3Destination|string|max:255',
            'access_key_id' => 'nullable|required_if:destination_type_type,App\\Models\\S3Destination|string|max:255',
            'access_key_secret' => 'nullable|required_if:destination_type_type,App\\Models\\S3Destination|string|max:255',
            'region' => 'nullable|required_if:destination_type_type,App\\Models\\S3Destination|string|max:255',
            'endpoint' => 'nullable|required_if:destination_type_type,App\\Models\\S3Destination|string|max:255',
            'version' => 'nullable|required_if:destination_type_type,App\\Models\\S3Destination|string|max:255',
            'storage_account_name' => 'nullable|required_if:destination_type_type,App\\Models\\AzureDestination|string|max:255',
            'storage_account_key' => 'nullable|required_if:destination_type_type,App\\Models\\AzureDestination|string|max:255',
            'container_name' => 'nullable|required_if:destination_type_type,App\\Models\\AzureDestination|string|max:255',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            // "name.required" => "The name is required.",
            // "name.string" => "The name must be a string.",
            // "name.max" => "The name must be less than 255 characters.",
            // "destination_type_type.required" => "The destination type is required.",
            // "destination_type_type.in" => "The destination type must be either S3 or Azure.",
            'bucket_name.required_if' => 'The bucket name is required.',
            // "bucket_name.string" => "The bucket name must be a string.",
            // "bucket_name.max" => "The bucket name must be less than 255 characters.",
            'access_key_id.required_if' => 'The access key ID is required.',
            // "access_key_id.string" => "The access key ID must be a string.",
            // "access_key_id.max" => "The access key ID must be less than 255 characters.",
            'access_key_secret.required_if' => 'The access key secret is required.',
            // "access_key_secret.string" => "The access key secret must be a string.",
            // "access_key_secret.max" => "The access key secret must be less than 255 characters.",
            'region.required_if' => 'The region is required.',
            // "region.string" => "The region must be a string.",
            // "region.max" => "The region must be less than 255 characters.",
            'endpoint.required_if' => 'The endpoint is required.',
            // "endpoint.string" => "The endpoint must be a string.",
            // "endpoint.max" => "The endpoint must be less than 255 characters.",
            'version.required_if' => 'The version is required.',
            // "version.string" => "The version must be a string.",
            // "version.max" => "The version must be less than 255 characters.",
            'storage_account_name.required_if' => 'The storage account name is required.',
            // "storage_account_name.string" => "The storage account name must be a string.",
            // "storage_account_name.max" => "The storage account name must be less than 255 characters.",
            'storage_account_key.required_if' => 'The storage account key is required.',
            // "storage_account_key.string" => "The storage account key must be a string.",
            // "storage_account_key.max" => "The storage account key must be less than 255 characters.",
            'container_name.required_if' => 'The container name is required.',
            // "container_name.string" => "The container name must be a string.",
            // "container_name.max" => "The container name must be less than 255 characters.",
        ];
    }
}
