<?php
namespace App\Services;

use App\Models\Category;
use App\Repositories\CategoryRepository;

class CategoryService
{
    protected $categoryRepo;

    public function __construct(CategoryRepository $categoryRepo)
    {
        $this->categoryRepo = $categoryRepo;
    }

    public function getAll($search, $perPage, $sortField, $sortDirection)
    {
        return $this->categoryRepo->all($search, $perPage, $sortField, $sortDirection);
    }

    public function getById($id)
    {
        return $this->categoryRepo->find($id);
    }

    public function create($name, $descriptiion): Category|null
    {
        $category = $this->categoryRepo->create($name, $descriptiion);
        if (!$category) {
            return null;
        }

        return $category;
    }

    public function update($category, $name, $descriptiion)
    {
        if ($category->id === 1) {
            // Prevent deletion of the default category
            return false;
        }
        $categoryUpdated = $this->categoryRepo->update($category, $name, $descriptiion);
        if (!$categoryUpdated) {
            return null;
        }
        
        return $categoryUpdated;
    }

    public function delete($category)
    {
        if ($category->id === 1) {
            // Prevent deletion of the default category
            return false;
        }
        return $this->categoryRepo->delete($category);
    }
}