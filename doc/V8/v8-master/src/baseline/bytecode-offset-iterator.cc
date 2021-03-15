// Copyright 2021 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "src/baseline/bytecode-offset-iterator.h"

#include "src/objects/code-inl.h"

namespace v8 {
namespace internal {
namespace baseline {

BytecodeOffsetIterator::BytecodeOffsetIterator(Handle<ByteArray> mapping_table,
                                               Handle<BytecodeArray> bytecodes)
    : mapping_table_(mapping_table),
      data_start_address_(mapping_table_->GetDataStartAddress()),
      data_length_(mapping_table_->length()),
      current_index_(0),
      bytecode_iterator_(bytecodes),
      local_heap_(LocalHeap::Current()
                      ? LocalHeap::Current()
                      : Isolate::Current()->main_thread_local_heap()) {
  local_heap_->AddGCEpilogueCallback(UpdatePointersCallback, this);
  current_pc_start_offset_ = ReadPosition();
  current_pc_end_offset_ = current_pc_start_offset_ + ReadPosition();
}

BytecodeOffsetIterator::~BytecodeOffsetIterator() {
  local_heap_->RemoveGCEpilogueCallback(UpdatePointersCallback, this);
}

void BytecodeOffsetIterator::UpdatePointers() {
  DisallowGarbageCollection no_gc;
  DCHECK(!mapping_table_.is_null());
  data_start_address_ = mapping_table_->GetDataStartAddress();
}

}  // namespace baseline
}  // namespace internal
}  // namespace v8
