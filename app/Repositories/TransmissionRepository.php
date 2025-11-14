<?php
namespace App\Repositories;

use App\Models\Transmission;

class TransmissionRepository
{
    public function all($search, $isActive, $isPowerOut, $perPage, $sortField, $sortDirection)
    {
        $query = Transmission::query();
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('address', 'like', "%{$search}%");
            });
        }

        if (!empty($isActive)) {
            $query->whereIn('is_active', $isActive);
        }

        if (!empty($isPowerOut)) {
            $query->whereIn('is_power_out', $isPowerOut);
        }

        if ($sortField && in_array($sortField, ['name', 'address','is_active', 'is_power_out', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        if ($perPage > 0) {
            $transmissions = $query->paginate($perPage)->withQueryString()->onEachSide(0);
        } else {
            $transmissions = $query->get();
        }

        return $transmissions;
    }

    public function find($id)
    {
        return Transmission::find($id);
    }

    public function create(array $data)
    {
        return Transmission::create($data);
    }

    public function update($transmission, $data)
    {
        $transmission->update($data);
        return $transmission;
    }

    public function delete($transmission)
    {
        return $transmission->delete();
    }
}