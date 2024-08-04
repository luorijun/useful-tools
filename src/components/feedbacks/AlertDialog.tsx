import {Dialog, DialogProps} from '@/components/feedbacks/Dialog'
import React from 'react'
import {Status} from '@/utils/status'

export type AlertDialogProps = {
  onConfirm?: () => Promise<void> | void
  status?: Status
} & Omit<DialogProps, 'title' | 'border' | 'height'>

export function AlertDialog(props: AlertDialogProps) {
  return (
    <Dialog
      {...props}
      width={400}
      title={`⚠️ 警告`}
    >
      <p>{props.children}</p>
      <Dialog.ConfirmFooter onClose={props.onClose} onConfirm={props.onConfirm}/>
    </Dialog>
  )
}
