<?php
namespace App\Services;

use App\Repositories\FeedbackRepository;
use App\Repositories\FileRepository;

class FeedbackService
{
    protected $feedbackRepo;
    protected $fileRepo;

    public function __construct(FeedbackRepository $feedbackRepo, FileRepository $fileRepo)
    {
        $this->feedbackRepo = $feedbackRepo;
        $this->fileRepo = $fileRepo;
    }

    public function getAll($maintenanceId, $search, $perPage, $sortField, $sortDirection)
    {
        return $this->feedbackRepo->all($maintenanceId, $search, $perPage, $sortField, $sortDirection);
    }

    public function getById($id)
    {
        return $this->feedbackRepo->find($id);
    }

    public function create($data, $file = null)
    {
        if ($data['file']) {
            $data['file_path'] = $this->fileRepo->store($file, "feedbacks");
        }
        return $this->feedbackRepo->create($data);
    }

    public function update($feedback, $data)
    {
        return $this->feedbackRepo->update($feedback, $data);
    }

    public function delete($feedback)
    {
        $this->fileRepo->delete($feedback->file_path);
        return $this->feedbackRepo->delete($feedback);
    }
}