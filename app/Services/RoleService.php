<?php
namespace App\Services;

use App\Repositories\RoleRepository;

class RoleService
{
    protected $roleRepo;

    public function __construct(RoleRepository $roleRepo)
    {
        $this->roleRepo = $roleRepo;
    }

    public function getAll()
    {
        return $this->roleRepo->all();
    }

    public function getById($id)
    {
        return $this->roleRepo->find($id);
    }

    public function create(array $data)
    {
        return $this->roleRepo->create($data);
    }

    public function update($id, array $data)
    {
        return $this->roleRepo->update($id, $data);
    }

    public function delete($id)
    {
        return $this->roleRepo->delete($id);
    }

    public function findOrFail($role)
    {
        return $this->roleRepo->findOrFail($role);
    }
}