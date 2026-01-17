<?php
namespace App\Repositories;

use App\Models\Device;
use Illuminate\Support\Facades\Hash;

class DeviceRepository
{
    public function all($search, $perPage, $sortField, $sortDirection)
    {
        $query = Device::query();
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
            $query->orWhere('type', 'like', "%{$search}%");
            $query->orWhere('identifier', 'like', "%{$search}%");
        }

        if ($sortField && in_array($sortField, ['name', 'type', 'identifier', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }

       $devices = $perPage == 0
            ? $query->get()
            : $query->paginate($perPage)->withQueryString()->onEachSide(0);

        return $devices;
    }

    public function find($id)
    {
        return Device::find($id);
    }

    public function findByIdentifier($identifier)
    {
        return Device::where('identifier', '=', $identifier)->firstOrFail();
    }

    public function create($data): Device
    {
        return Device::create($data);
    }

    public function update($device, $data)
    {
        $device->update($data);

        return $device;
    }

    public function delete($device)
    {
        return $device->delete();
    }
}