<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateDestination;
use App\Models\Destination;
use App\Models\S3Destination;
use App\Services\DestinationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class DestinationController extends Controller
{
    public function index(): InertiaResponse
    {
        return Inertia::render('destinations/index', [
            'destinations' => Destination::with('destination_type')->orderBy('name', 'asc')->get(),
        ]);
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('destinations/create');
    }

    public function show(Destination $destination): InertiaResponse
    {
        if ($destination->destination_type_type === 'App\\Models\\S3Destination') {
            $destinationService = new DestinationService;
            $s3Client = $destinationService->getDestinationClient($destination);

            $s3UploadsResult = $s3Client->listMultipartUploads([
                'Bucket' => $destination->destination_type->bucket_name,
            ]);
        }

        return Inertia::render('destinations/show', [
            'destination' => $destination->load('destination_type'),
            's3_uploads' => $s3UploadsResult['Uploads'] ?? [],
        ]);
    }

    public function store(CreateDestination $request): RedirectResponse
    {
        $data = $request->validated();

        switch ($data['destination_type_type']) {
            case 'App\\Models\\S3Destination':
                $destination = S3Destination::create($data);
                break;
            case 'App\\Models\\AzureDestination':
                throw new \Exception('Azure destination not implemented');
                // $destination = AzureDestination::create($data);
                break;
        }

        $destination->destination()->create($data);

        return redirect()->route('destinations.index');
    }

    public function abortS3Upload(Request $request, Destination $destination): RedirectResponse
    {
        $data = $request->validate([
            'key' => 'required|string',
            'upload_id' => 'required|string',
        ]);

        $destinationService = new DestinationService;
        $s3Client = $destinationService->getDestinationClient($destination);

        $result = $s3Client->abortMultipartUpload([
            'Bucket' => $destination->destination_type->bucket_name,
            'Key' => $data['key'],
            'UploadId' => $data['upload_id'],
        ]);

        if ($result['@metadata']['statusCode'] === 204) {
            return back()
                ->with('message', 'Upload aborted successfully.');
        }

        return abort(500, 'Failed to abort upload.');
    }
}
