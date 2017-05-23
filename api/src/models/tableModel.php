<?php
class TableModel {

	 protected $table;
	 protected $db;
	 function __construct($db, $table){
	 	$this->db = $db;
	 	$this->table = $table;
	 }

	 public function get($id = FALSE)
	 {
	 	if(!$id){
	 		return $this->db->table($this->table)->get();
	 	}else{
	 		return $this->db->table($this->table)->where('id','=',$id)->get();
	 	}
	 }

}