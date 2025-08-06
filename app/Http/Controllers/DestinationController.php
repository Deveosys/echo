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
        return Inertia::render('destinations/show', [
            'destination' => $destination->load('destination_type'),
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
