<?php
namespace App\Repositories;

use App\Models\Feedback;

class FeedbackRepository
{
    public function all($maintenanceId, $search, $perPage, $sortField, $sortDirection)
    {
        $query = Feedback::query()->select('feedbacks.*');
        // if ($search) {
        //     $query->where(function($q) use ($search) {
        //         $q->where('inventories.name', 'like', "%{$search}%")
        //         ->orWhere('inventories.inventory_code', 'like', "%{$search}%")
        //         ->orWhere('categories.name', 'like', "%{$search}%")
        //         ->orWhere('transmissions.name', 'like', "%{$search}%")
        //         ->orWhere('inventories.description', 'like', "%{$search}%");
        //     });
        // }
        // $query->join('categories', 'inventories.category_id', '=', 'categories.id');
        // $query->join('transmissions', 'inventories.transmission_id', '=', 'transmissions.id');

        if ($maintenanceId) {
            $query->where('feedbacks.maintenance_id', $maintenanceId);
        }

        if ($sortField && in_array($sortField, ['id', 'inventory_code', 'name', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        if ($sortField == "category") {
            $query->orderBy("categories.name", $sortDirection);
        }

        if ($sortField == "transmission") {
            $query->orderBy("transmissions.name", $sortDirection);
        }

        if ($perPage > 0) {
            $feedbacks = $query->with(['category:id,name', 'transmission:id,name'])->paginate($perPage)->withQueryString()->onEachSide(0);
        } else {
            $feedbacks = $query->get();
        }


        return $feedbacks;
    }

    public function find($id)
    {
        return Feedback::find($id);
    }

    public function create($data): Feedback
    {
        return Feedback::create($data);
    }

    public function update($feedback, $data)
    {
        $feedback->update($data);
        return $feedback;
    }

    public function delete($feedback)
    {
        return $feedback->delete();
    }
}