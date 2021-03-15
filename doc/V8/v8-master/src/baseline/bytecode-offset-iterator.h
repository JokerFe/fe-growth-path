// Copyright 2021 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef V8_BASELINE_BYTECODE_OFFSET_ITERATOR_H_
#define V8_BASELINE_BYTECODE_OFFSET_ITERATOR_H_

#include "src/base/vlq.h"
#include "src/common/globals.h"
#include "src/interpreter/bytecode-array-iterator.h"
#include "src/objects/code.h"
#include "src/objects/fixed-array.h"

namespace v8 {
namespace internal {

class BytecodeArray;

namespace baseline {

class V8_EXPORT_PRIVATE BytecodeOffsetIterator {
 public:
  // TODO(pthier): Create un-handlified version.
  BytecodeOffsetIterator(Handle<ByteArray> mapping_table,
                         Handle<BytecodeArray> bytecodes);
  ~BytecodeOffsetIterator();

  inline void Advance() {
    DCHECK(!done());
    current_pc_start_offset_ = current_pc_end_offset_;
    current_pc_end_offset_ += ReadPosition();
    bytecode_iterator_.Advance();
  }

  inline void AdvanceToBytecodeOffset(int bytecode_offset) {
    while (current_bytecode_offset() < bytecode_offset) {
      Advance();
    }
    DCHECK(bytecode_offset == current_bytecode_offset() ||
           // If kFunctionEntryBytecodeOffset is passed as bytecode_ofset, we
           // want to return the PC for the first real bytecode.
           bytecode_offset == kFunctionEntryBytecodeOffset);
  }

  inline void AdvanceToPCOffset(Address pc_offset) {
    while (current_pc_end_offset() < pc_offset) {
      Advance();
    }
    // pc could be inside the baseline prologue, wich means we didn't record any
    // position for it.
    DCHECK(pc_offset > current_pc_start_offset() ||
           current_bytecode_offset() == 0);
    DCHECK_LE(pc_offset, current_pc_end_offset());
  }

  // For this iterator, done() means that it is not safe to advance().
  // Values are cached, so reads are always allowed.
  inline bool done() const { return current_index_ >= data_length_; }

  inline Address current_pc_start_offset() const {
    return current_pc_start_offset_;
  }

  inline Address current_pc_end_offset() const {
    return current_pc_end_offset_;
  }

  inline int current_bytecode_offset() const {
    return bytecode_iterator_.current_offset();
  }

  static void UpdatePointersCallback(void* iterator) {
    reinterpret_cast<BytecodeOffsetIterator*>(iterator)->UpdatePointers();
  }

  void UpdatePointers();

 private:
  inline int ReadPosition() {
    return base::VLQDecodeUnsigned(data_start_address_, &current_index_);
  }

  Handle<ByteArray> mapping_table_;
  byte* data_start_address_;
  int data_length_;
  int current_index_;
  Address current_pc_start_offset_;
  Address current_pc_end_offset_;
  interpreter::BytecodeArrayIterator bytecode_iterator_;
  LocalHeap* local_heap_;
};

}  // namespace baseline
}  // namespace internal
}  // namespace v8

#endif  // V8_BASELINE_BYTECODE_OFFSET_ITERATOR_H_
