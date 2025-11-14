<?php
namespace App\Repositories;

use App\Models\Category;

class CategoryRepository
{
    public function all($search, $perPage, $sortField, $sortDirection)
    {
        $query = Category::query();
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($sortField && in_array($sortField, ['id', 'name', 'description', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        $categories = $query->paginate($perPage)->withQueryString()->onEachSide(0);

        return $categories;
    }

    public function find($id)
    {
        return Category::find($id);
    }

    public function create($name, $description): Category
    {
        return Category::create([
            'name' => $name,
            'description' => $description,
        ]);
    }

    public function update($category, $name, $description)
    {
        $category->update([
            'name' => $name,
            'description' => $description,
        ]);

        return $category;
    }

    public function delete($category)
    {
        return $category->delete();
    }
}