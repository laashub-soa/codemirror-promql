// The MIT License (MIT)
//
// Copyright (c) 2020 The Prometheus Authors
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { EditorState } from '@codemirror/state';
import { SyntaxNode } from 'lezer-tree';
import {
  And,
  BinaryExpr,
  BinModifiers,
  GroupingLabel,
  GroupingLabelList,
  GroupingLabels,
  GroupLeft,
  GroupRight,
  On,
  OnOrIgnoring,
  Or,
  Unless,
} from 'lezer-promql';
import { VectorMatchCardinality, VectorMatching } from '../types/vector';
import { containsAtLeastOneChild, retrieveAllRecursiveNodes } from './path-finder';

export function buildVectorMatching(state: EditorState, binaryNode: SyntaxNode) {
  if (!binaryNode || binaryNode.type.id !== BinaryExpr) {
    return null;
  }
  const result: VectorMatching = {
    card: VectorMatchCardinality.CardOneToOne,
    matchingLabels: [],
    on: false,
    include: [],
  };
  const binModifiers = binaryNode.getChild(BinModifiers);
  if (binModifiers) {
    const onOrIgnoring = binModifiers.getChild(OnOrIgnoring);
    if (onOrIgnoring) {
      result.on = onOrIgnoring.getChild(On) !== null;
      const labels = retrieveAllRecursiveNodes(onOrIgnoring.getChild(GroupingLabels), GroupingLabelList, GroupingLabel);
      if (labels.length > 0) {
        for (const label of labels) {
          result.matchingLabels.push(state.sliceDoc(label.from, label.to));
        }
      }
    }

    const groupLeft = binModifiers.getChild(GroupLeft);
    const groupRight = binModifiers.getChild(GroupRight);
    if (groupLeft || groupRight) {
      result.card = groupLeft ? VectorMatchCardinality.CardManyToOne : VectorMatchCardinality.CardOneToMany;
      const includeLabels = retrieveAllRecursiveNodes(binModifiers.getChild(GroupingLabels), GroupingLabelList, GroupingLabel);
      if (includeLabels.length > 0) {
        for (const label of includeLabels) {
          result.include.push(state.sliceDoc(label.from, label.to));
        }
      }
    }
  }

  const isSetOperator = containsAtLeastOneChild(binaryNode, And, Or, Unless);
  if (isSetOperator && result.card === VectorMatchCardinality.CardOneToOne) {
    result.card = VectorMatchCardinality.CardManyToMany;
  }
  return result;
}
