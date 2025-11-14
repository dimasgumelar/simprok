<?php
namespace App\Repositories;

use App\Models\Maintenance;
use Illuminate\Support\Facades\DB;

class MaintenanceRepository
{
    public function all($search, $perPage, $sortField, $sortDirection, $userId = null, $createdBy = null, $status = null)
    {
        $query = Maintenance::query()->select('maintenances.*');
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('inventories.name', 'like', "%{$search}%")
                ->orWhere('transmissions.name', 'like', "%{$search}%")
                ->orWhere('maintenances.description', 'like', "%{$search}%")
                ->orWhere('users.name', 'like', "%{$search}%");
            });
        }
        $query->join('inventories', 'maintenances.inventory_id', '=', 'inventories.id');
        $query->join('transmissions', 'maintenances.transmission_id', '=', 'transmissions.id');
        $query->join('users', 'maintenances.user_id', '=', 'users.id');
        if ($sortField && in_array($sortField, ['id', 'status', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        if ($sortField == "inventory") {
            $query->orderBy("inventories.name", $sortDirection);
        }

        if ($sortField == "transmission") {
            $query->orderBy("transmissions.name", $sortDirection);
        }

        if ($sortField == "name") {
            $query->orderBy("users.name", $sortDirection);
        }

        if ($userId) {
            $query->where("user_id", $userId);
        }

        if ($createdBy) {
            $query->where("created_by", $createdBy);
        }

        if ($status) {
            $query->where("status", $status);
        }

        $maintenances = $query->with(['inventory:id,name', 'transmission:id,name', 'user:id,name'])->paginate($perPage)->withQueryString()->onEachSide(0);

        return $maintenances;
    }

    public function info($userId = null, $createdBy = null)
    {
        $query = Maintenance::query()->select('maintenances.status', DB::raw('COUNT(maintenances.status) as status_count'));
        
        if ($userId) {
            $query->where("user_id", $userId);
        }

        if ($createdBy) {
            $query->where("created_by", $createdBy);
        }

        $query->groupBy("maintenances.status");

        $maintenances = $query->get();

        return $maintenances;
    }

    public function find($id)
    {
        return Maintenance::find($id);
    }

    public function create($data): Maintenance
    {
        // dd($data);
        return Maintenance::create($data);
    }

    public function update($maintenance, $data)
    {
        $maintenance->update($data);
        return $maintenance;
    }

    public function delete($maintenance)
    {
        return $maintenance->delete();
    }
}