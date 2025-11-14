<?php
namespace App\Repositories;

use Spatie\Permission\Models\Role;

class RoleRepository
{
    public function all()
    {
        return Role::all();
    }

    public function find($id)
    {
        return Role::find($id);
    }

    public function create(array $data)
    {
        return Role::create($data);
    }

    public function update($id, array $data)
    {
        $role = $this->find($id);
        if (!$role) {
            return null;
        }
        $role->update($data);
        return $role;
    }

    public function delete($id)
    {
        $role = $this->find($id);
        if (!$role) {
            return false;
        }
        return $role->delete();
    }

    public function findOrFail($roleId)
    {
        return Role::findOrFail($roleId);
    }
}