<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateDestination;
use App\Models\Destination;
use App\Models\S3Destination;
use Illuminate\Http\RedirectResponse;
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
        $buckets = [];

        if ($destination->destination_type_type === 'App\\Models\\S3Destination') {
            $s3Destination = $destination->destination_type()->first();

            $access_key_id = $s3Destination->access_key_id;
            $access_key_secret = $s3Destination->access_key_secret;
            $endpoint = $s3Destination->endpoint;
            $bucket_name = $s3Destination->bucket_name;

            $credentials = new \Aws\Credentials\Credentials($access_key_id, $access_key_secret);

            $options = [
                'region' => 'auto',
                'endpoint' => $endpoint,
                'version' => 'latest',
                'credentials' => $credentials,
            ];

            $s3_client = new \Aws\S3\S3Client($options);

            // $contents = $s3_client->listObjectsV2([
            //     'Bucket' => $bucket_name
            // ]);

            // dd($contents['Contents']);

            $buckets = $s3_client->listBuckets();
        }

        dd($buckets);

        return Inertia::render('destinations/show', [
            'destination' => $destination->load('destination_type'),
            'buckets' => $buckets,
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
}
