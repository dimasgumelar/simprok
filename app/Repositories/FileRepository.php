<?php
namespace App\Repositories;
use Illuminate\Support\Facades\Storage;

class FileRepository
{
    public function store($file, $folder)
    {
        return $file->store($folder, 'public');
    }

    public function delete($filePath)
    {
        if ($filePath) {
            Storage::disk('public')->delete($filePath);
        }
    }

    // public function store($file, $folder)
    // {
    //     $filename = $file->hashName();
    //     $destination = base_path('../storage/'.$folder);
    //     if (!file_exists($destination)) {
    //         mkdir($destination, 0755, true);
    //     }
    //     $file->move($destination, $filename);
    //     return $folder.'/' . $filename;
    // }

    // public function delete($filePath)
    // {
    //     if (empty($filePath)) {
    //         return;
    //     }
    //     $oldPath = base_path('../storage/' . $filePath);
    //     if (file_exists($oldPath)) {
    //         unlink($oldPath);
    //     }
    // }
}