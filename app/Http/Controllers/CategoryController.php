<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{

    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Ambil input filter
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        // Ambil input sorting
        $sortField = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'asc');

        $categories = $this->categoryService->getAll($search, $perPage, $sortField, $sortDirection);

        return Inertia::render('Categories/Index', compact('categories'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Categories/Form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string|max:1000',
        ]);

        $category = $this->categoryService->create($request->input('name'), $request->input('description'));
        if (!$category) {
            return redirect()->back()->with('error', 'Failed to create category.');
        }

        return redirect()->route('categories.index')->with('success', 'Category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        // Prevent editing of the default category
        if ($category->id === 1) {
            return redirect()->route('categories.index')->with('error', 'Default category cannot be edited.');
        }
        
        return Inertia::render('Categories/Form', [
            'category' => $category,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories')->ignore($category->id)
            ],
            'description' => 'nullable|string|max:1000',
        ]);

        $updatedCategory = $this->categoryService->update($category, $request->input('name'), $request->input('description'));
        if (!$updatedCategory) {
            return redirect()->back()->with('error', 'Failed to update category.');
        }

        return redirect()->route('categories.index')->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $deleted = $this->categoryService->delete($category);
        if (!$deleted) {
            return redirect()->back()->with('error', 'Gagal menghapus data kategori.');
        }

        return redirect()->route('categories.index')->with('success', 'Category deleted successfully.');
    }
}