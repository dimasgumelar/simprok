<?php
namespace App\Services;

use App\Models\Device;
use App\Repositories\DeviceRepository;
use Illuminate\Support\Str;

class DeviceService
{
    protected $deviceRepo;

    public function __construct(DeviceRepository $deviceRepo)
    {
        $this->deviceRepo = $deviceRepo;
    }

    public function getAll($search, $perPage, $sortField, $sortDirection)
    {
        return $this->deviceRepo->all($search, $perPage, $sortField, $sortDirection);
    }

    public function getById($id)
    {
        return $this->deviceRepo->find($id);
    }

    public function create($data): Device|null
    {
        $data["identifier"] = (string) Str::uuid();
        $device = $this->deviceRepo->create($data);
        if (!$device) {
            return null;
        }

        return $device;
    }

    public function update($device, $data)
    {
        $deviceUpdated = $this->deviceRepo->update($device, $data);
        if (!$deviceUpdated) {
            return null;
        }
        
        return $deviceUpdated;
    }

    public function delete($device)
    {
        return $this->deviceRepo->delete($device);
    }
}